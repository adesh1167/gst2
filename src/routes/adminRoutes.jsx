import React from 'react'
import { Navigate, Routes, Route } from 'react-router'
import Home from './home'
import UploadMatches from './admin/uploadMatches'

const AdminRoutes = () => {
  return (
    <Routes>
        <Route path='/' element={<Navigate to="/admin" replace/>}/>
        <Route path='/admin' element={<Home/>}>
            {/* <Route path='make' element={<ManageContacts/>}/> */}
            {/* <Route path='manage-contacts/edit/:contactId' element={<EditContact/>}/> */}
        </Route>
        <Route path="/admin/upload-matches" element={<UploadMatches/>}/>
        <Route path='*' element={<h1>404</h1>}/>
    </Routes>
  )
}

export default AdminRoutes
