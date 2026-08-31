import React from 'react';
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Activity(){
  const [items,setItems]=useState([]);
  const [error,setError]=useState("");
  useEffect(()=>{api.get("/activity").then(r=>setItems(r.data)).catch(e=>setError(e.response?.data?.message||"Unable to load activity"));},[]);
  return <>
    <div className="page-heading"><div><h2>Activity Logs</h2><p>Audit trail showing who changed what.</p></div></div>
    {error&&<div className="alert error">{error}</div>}
    <div className="panel table-wrap"><table><thead><tr><th>Date</th><th>User</th><th>Action</th><th>Entity</th><th>Description</th></tr></thead><tbody>
      {items.map(x=><tr key={x._id}><td>{new Date(x.createdAt).toLocaleString()}</td><td>{x.userName}</td><td><span className="badge">{x.action}</span></td><td>{x.entityType}</td><td>{x.description}</td></tr>)}
      {!items.length&&<tr><td colSpan="5" className="empty">No activity yet.</td></tr>}
    </tbody></table></div>
  </>;
}
