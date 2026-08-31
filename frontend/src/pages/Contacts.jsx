import React from 'react';
import { useEffect, useState } from "react";
import api from "../services/api";
import Modal from "../components/Modal";

const empty = { firstName:"", lastName:"", email:"", phone:"", company:"", jobTitle:"", notes:"" };

export default function Contacts() {
  const [data, setData] = useState({items:[], pages:1});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("crm_user") || "{}");

  async function load() {
    const {data} = await api.get("/contacts", {params:{search,page,limit:10}});
    setData(data);
  }
  useEffect(() => {load().catch(()=>setMessage("Could not load contacts"));}, [search,page]);

  function open(item) {
    setEditing(item || null);
    setForm(item ? {...empty,...item} : empty);
    setShow(true);
  }

  async function save(e) {
    e.preventDefault();
    try {
      if (editing) await api.put(`/contacts/${editing._id}`, form);
      else await api.post("/contacts", form);
      setShow(false); setMessage("Contact saved"); load();
    } catch(e) {setMessage(e.response?.data?.message || "Save failed");}
  }

  async function remove(id) {
    if(!confirm("Delete this contact?")) return;
    try {await api.delete(`/contacts/${id}`); setMessage("Contact deleted"); load();}
    catch(e){setMessage(e.response?.data?.message || "Delete failed");}
  }

  return <>
    <div className="page-heading"><div><h2>Contacts</h2><p>Manage people connected to your sales opportunities.</p></div><button className="primary-btn" onClick={()=>open()}>+ Add Contact</button></div>
    {message && <div className="alert">{message}</div>}
    <div className="toolbar"><input placeholder="Search contacts..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}}/></div>
    <div className="panel table-wrap"><table><thead><tr><th>Name</th><th>Company</th><th>Job title</th><th>Email</th><th>Phone</th><th>Actions</th></tr></thead><tbody>
      {data.items.map(x=><tr key={x._id}><td><strong>{x.firstName} {x.lastName}</strong></td><td>{x.company||"—"}</td><td>{x.jobTitle||"—"}</td><td>{x.email}</td><td>{x.phone||"—"}</td><td className="actions"><button onClick={()=>open(x)}>Edit</button>{user.role==="admin"&&<button className="danger-text" onClick={()=>remove(x._id)}>Delete</button>}</td></tr>)}
      {!data.items.length&&<tr><td colSpan="6" className="empty">No contacts found.</td></tr>}
    </tbody></table></div>
    <Pagination page={page} pages={data.pages} setPage={setPage}/>
    {show&&<Modal title={editing?"Edit Contact":"Add Contact"} onClose={()=>setShow(false)}><form onSubmit={save} className="form-grid">
      <label>First name<input required value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})}/></label>
      <label>Last name<input value={form.lastName||""} onChange={e=>setForm({...form,lastName:e.target.value})}/></label>
      <label>Email<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label>
      <label>Phone<input value={form.phone||""} onChange={e=>setForm({...form,phone:e.target.value})}/></label>
      <label>Company<input value={form.company||""} onChange={e=>setForm({...form,company:e.target.value})}/></label>
      <label>Job title<input value={form.jobTitle||""} onChange={e=>setForm({...form,jobTitle:e.target.value})}/></label>
      <label className="full">Notes<textarea value={form.notes||""} onChange={e=>setForm({...form,notes:e.target.value})}/></label>
      <div className="form-actions"><button type="button" onClick={()=>setShow(false)}>Cancel</button><button className="primary-btn">Save Contact</button></div>
    </form></Modal>}
  </>;
}

function Pagination({page,pages,setPage}){return <div className="pagination"><button disabled={page<=1} onClick={()=>setPage(page-1)}>Previous</button><span>Page {page} of {pages||1}</span><button disabled={page>=pages} onClick={()=>setPage(page+1)}>Next</button></div>}
