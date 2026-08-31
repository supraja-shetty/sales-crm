import React from 'react';
import { useEffect, useState } from "react";
import api from "../services/api";
import Modal from "../components/Modal";

const empty={title:"",contact:"",company:"",value:"",stage:"New",expectedCloseDate:"",probability:20,notes:""};

export default function Deals(){
  const [data,setData]=useState({items:[],pages:1});
  const [contacts,setContacts]=useState([]);
  const [search,setSearch]=useState("");
  const [stage,setStage]=useState("");
  const [page,setPage]=useState(1);
  const [form,setForm]=useState(empty);
  const [editing,setEditing]=useState(null);
  const [show,setShow]=useState(false);
  const [message,setMessage]=useState("");
  const user=JSON.parse(localStorage.getItem("crm_user")||"{}");

  async function load(){
    const [deals, cs]=await Promise.all([
      api.get("/deals",{params:{search,stage,page,limit:10}}),
      api.get("/contacts",{params:{limit:100}})
    ]);
    setData(deals.data); setContacts(cs.data.items);
  }
  useEffect(()=>{load().catch(e=>setMessage(e.response?.data?.message||"Could not load deals"));},[search,stage,page]);

  function open(item){
    setEditing(item||null);
    setForm(item?{...empty,...item,contact:item.contact?._id||item.contact,expectedCloseDate:item.expectedCloseDate?item.expectedCloseDate.slice(0,10):""}:empty);
    setShow(true);
  }

  async function save(e){
    e.preventDefault();
    try{
      const payload={...form,value:Number(form.value),probability:Number(form.probability)};
      if(editing) await api.put(`/deals/${editing._id}`,payload); else await api.post("/deals",payload);
      setShow(false);setMessage("Deal saved");load();
    }catch(e){setMessage(e.response?.data?.message||"Save failed");}
  }

  async function remove(id){
    if(!confirm("Delete this deal?"))return;
    try{await api.delete(`/deals/${id}`);setMessage("Deal deleted");load();}catch(e){setMessage(e.response?.data?.message||"Delete failed");}
  }

  return <>
    <div className="page-heading"><div><h2>Deals</h2><p>Track opportunities from New to Won or Lost.</p></div><button className="primary-btn" onClick={()=>open()}>+ Add Deal</button></div>
    {message&&<div className="alert">{message}</div>}
    <div className="toolbar"><input placeholder="Search deal or company..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}}/><select value={stage} onChange={e=>{setStage(e.target.value);setPage(1)}}><option value="">All stages</option>{["New","In Progress","Won","Lost"].map(x=><option key={x}>{x}</option>)}</select></div>
    <div className="panel table-wrap"><table><thead><tr><th>Deal</th><th>Contact</th><th>Value</th><th>Stage</th><th>Probability</th><th>Close date</th><th>Actions</th></tr></thead><tbody>
      {data.items.map(x=><tr key={x._id}><td><strong>{x.title}</strong><small>{x.company||""}</small></td><td>{x.contact?.firstName} {x.contact?.lastName}</td><td>₹{Number(x.value).toLocaleString("en-IN")}</td><td><span className={`badge ${x.stage.toLowerCase().replace(" ","-")}`}>{x.stage}</span></td><td>{x.probability}%</td><td>{x.expectedCloseDate?new Date(x.expectedCloseDate).toLocaleDateString():"—"}</td><td className="actions"><button onClick={()=>open(x)}>Edit</button>{user.role==="admin"&&<button className="danger-text" onClick={()=>remove(x._id)}>Delete</button>}</td></tr>)}
      {!data.items.length&&<tr><td colSpan="7" className="empty">No deals found.</td></tr>}
    </tbody></table></div>
    <Pagination page={page} pages={data.pages} setPage={setPage}/>
    {show&&<Modal title={editing?"Edit Deal":"Add Deal"} onClose={()=>setShow(false)}><form onSubmit={save} className="form-grid">
      <label>Deal title<input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label>
      <label>Contact<select required value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})}><option value="">Select contact</option>{contacts.map(c=><option key={c._id} value={c._id}>{c.firstName} {c.lastName} · {c.company}</option>)}</select></label>
      <label>Company<input value={form.company||""} onChange={e=>setForm({...form,company:e.target.value})}/></label>
      <label>Value (₹)<input required type="number" min="0" value={form.value} onChange={e=>setForm({...form,value:e.target.value})}/></label>
      <label>Stage<select value={form.stage} onChange={e=>setForm({...form,stage:e.target.value})}>{["New","In Progress","Won","Lost"].map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Probability (%)<input type="number" min="0" max="100" value={form.probability} onChange={e=>setForm({...form,probability:e.target.value})}/></label>
      <label>Expected close date<input type="date" value={form.expectedCloseDate||""} onChange={e=>setForm({...form,expectedCloseDate:e.target.value})}/></label>
      <label className="full">Notes<textarea value={form.notes||""} onChange={e=>setForm({...form,notes:e.target.value})}/></label>
      <div className="form-actions"><button type="button" onClick={()=>setShow(false)}>Cancel</button><button className="primary-btn">Save Deal</button></div>
    </form></Modal>}
  </>;
}
function Pagination({page,pages,setPage}){return <div className="pagination"><button disabled={page<=1} onClick={()=>setPage(page-1)}>Previous</button><span>Page {page} of {pages||1}</span><button disabled={page>=pages} onClick={()=>setPage(page+1)}>Next</button></div>}
