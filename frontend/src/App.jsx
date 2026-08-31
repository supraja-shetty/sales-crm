import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Contacts from "./pages/Contacts";
import Deals from "./pages/Deals";
import Activity from "./pages/Activity";
import Notifications from "./pages/Notifications";

export default function App(){
  return <Routes>
    <Route path="/login" element={<Login/>}/>
    <Route path="/" element={<ProtectedRoute><Layout/></ProtectedRoute>}>
      <Route index element={<Dashboard/>}/>
      <Route path="leads" element={<Leads/>}/>
      <Route path="contacts" element={<Contacts/>}/>
      <Route path="deals" element={<Deals/>}/>
      <Route path="activity" element={<Activity/>}/>
      <Route path="notifications" element={<Notifications/>}/>
    </Route>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes>;
}
