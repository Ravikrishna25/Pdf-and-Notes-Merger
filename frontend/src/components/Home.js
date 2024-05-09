import React, { Fragment, useEffect, useState } from 'react'
import MetaData from './layouts/MetaData'
import { useDispatch, useSelector } from 'react-redux';
import Loader from './layouts/Loader';
import { toast } from 'react-toastify';
import Pagination from "react-js-pagination";
import FormWithPDFMerge from './user/FormWithPDFMerge';


function Home(){
   
    
    
    return (
 
       
            <Fragment>  
                <MetaData title={'Case Manager'} />
                <FormWithPDFMerge />
               
        </Fragment> 


    )
} 

export default Home; 