
import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { PDFDocument } from 'pdf-lib';
import { Button, Upload, Card, Typography, Form } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { DndContext, PointerSensor, useSensor } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Input } from 'antd';

const { TextArea } = Input;

const DraggableUploadListItem = ({ originNode, file }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: file.uid,
  });

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    transition,
    cursor: 'move',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'is-dragging' : ''}
      {...attributes}
      {...listeners}
    >
      {originNode}
    </div>
  );
};

const FormWithPDFMerge = () => {
  const [fileList, setFileList] = useState([]);
  const [sortedFileList, setSortedFileList] = useState([]);
  const [mergedPdf, setMergedPdf] = useState(null);
  const [error, setError] = useState(null);
  const [value, setValue] = useState('');

  const sensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setSortedFileList((prev) => {
        const newFileList = arrayMove(prev, prev.findIndex((i) => i.uid === active.id), prev.findIndex((i) => i.uid === over?.id));
        setFileList(newFileList); // Update fileList to trigger re-render
        return newFileList;
      });
    }
  };

  useEffect(() => {
    // Merge PDFs whenever the sorted file list changes
    mergePDFs(value);
  }, [sortedFileList, value]);

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setSortedFileList(newFileList);
  };

  const mergePDFs = async (textareaContent) => {
    try {
      const mergedDoc = await PDFDocument.create();

      // Add generated PDF from textarea content
      const jspdf = new jsPDF('p', 'pt', 'letter');
      let verticalPosition = 30;
      let leftMargin = 34;
      let rightMargin = 580;
      const sentences = textareaContent.split(/[.!?]/);

      sentences.forEach((sentence) => {
        const sentenceLines = jspdf.splitTextToSize(sentence.trim(), rightMargin - leftMargin);
        const lineHeight = jspdf.getLineHeight() * 1.2;

        sentenceLines.forEach((line) => {
          if (verticalPosition + lineHeight > jspdf.internal.pageSize.height - 20) {
            jspdf.addPage();
            verticalPosition = 30;
          }
          jspdf.text(line, leftMargin, verticalPosition);
          verticalPosition += lineHeight;
        });
      });

      const generatedPdfBytes = jspdf.output('arraybuffer');
      const generatedPdfDoc = await PDFDocument.load(generatedPdfBytes);
      const copiedGeneratedPages = await mergedDoc.copyPages(generatedPdfDoc, generatedPdfDoc.getPageIndices());
      copiedGeneratedPages.forEach((page) => {
        mergedDoc.addPage(page);
      });

      // Add uploaded PDF files in sorted order
      for (const file of sortedFileList) {
        const pdfBytes = await file.originFileObj.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => {
          mergedDoc.addPage(page);
        });
      }

      const mergedPdfBytes = await mergedDoc.save();
      setMergedPdf(new Blob([mergedPdfBytes], { type: 'application/pdf' }));
      setError(null);
    } catch (error) {
      console.error('Error merging PDFs:', error);
      setError('Failed to merge PDFs. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await mergePDFs(value);

    // Trigger download
    if (mergedPdf) {
      const blob = new Blob([mergedPdf], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged_pdf.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div>
      <Card style={{ height: "40%", width: "60%", marginLeft: "30%", width: "40%", marginTop: "2%", borderRadius: "10px", boxShadow: "5px 5px 10px #DAC0A3" }} >
        <Typography.Title level={1} style={{ marginLeft: "15%" }}>
          CaseMitra Downloader
      </Typography.Title>

        <form onSubmit={handleSubmit}>
          <Form.Item label="Summary">

            <TextArea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter text here"
              autoSize={{ minRows: 3, maxRows: 5 }}
              style={{ width: '500px' }}
            />
          </Form.Item>
          <br />

          <Form.Item label="Upload Matter Files">

          </Form.Item>

          <DndContext sensors={[sensor]} onDragEnd={onDragEnd}>
            <SortableContext items={fileList.map((file) => file.uid)} strategy={verticalListSortingStrategy}>
              <Upload.Dragger
                fileList={fileList}
                onChange={onChange}
                itemRender={(originNode, file) => (
                  <DraggableUploadListItem originNode={originNode} file={file} />
                )}
                beforeUpload={() => false} // Prevent auto-uploading
                multiple
              >
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
              </Upload.Dragger>
            </SortableContext>
          </DndContext>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <Button  htmlType="submit" shape="round" icon={<DownloadOutlined />} size={"large"} style={{ marginLeft: "28%", marginTop: "3%",backgroundColor:"#C6A969"}}>
            Generate and Merge
        </Button>
        </form>
      </Card>
    </div>
  );
};

export default FormWithPDFMerge;
