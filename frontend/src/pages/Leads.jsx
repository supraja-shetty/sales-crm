import React from 'react';
import { useEffect, useState } from "react";
import api from "../services/api";
import Modal from "../components/Modal";

const empty = { firstName: "", lastName: "", email: "", phone: "", company: "", source: "Website", status: "New", notes: "" };

export default function Leads() {
  const [data, setData] = useState({ items: [], total: 0, pages: 1 });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    const { data } = await api.get("/leads", { params: { search, status, page, limit: 10 } });
    setData(data);
  }

  useEffect(() => { load().catch(() => setMessage("Could not load leads")); }, [search, status, page]);

  function openCreate() { setEditing(null); setForm(empty); setShow(true); }
  function openEdit(item) { setEditing(item); setForm({ ...empty, ...item }); setShow(true); }

  async function save(e) {
    e.preventDefault();
    try {
      if (editing) await api.put(`/leads/${editing._id}`, form);
      else await api.post("/leads", form);
      setShow(false); setMessage("Lead saved successfully"); load();
    } catch (e) { setMessage(e.response?.data?.message || "Save failed"); }
  }

  async function remove(id) {
    if (!confirm("Delete this lead?")) return;
    try { await api.delete(`/leads/${id}`); setMessage("Lead deleted"); load(); }
    catch (e) { setMessage(e.response?.data?.message || "Delete failed"); }
  }

  async function convert(id) {
    try { await api.post(`/leads/${id}/convert`); setMessage("Lead converted to contact"); load(); }
    catch (e) { setMessage(e.response?.data?.message || "Conversion failed"); }
  }

  return (
    <>
      <div className="page-heading">
        <div><h2>Leads</h2><p>Capture, qualify and convert prospects.</p></div>
        <button className="primary-btn" onClick={openCreate}>+ Add Lead</button>
      </div>

      {message && <div className="alert">{message}</div>}

      <div className="toolbar">
        <input placeholder="Search name, email, company..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All statuses</option>
          {["New", "Contacted", "Qualified", "Unqualified", "Converted"].map(x => <option key={x}>{x}</option>)}
        </select>
      </div>

      <div className="panel table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Company</th><th>Email</th><th>Source</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {data.items.map((x) => (
              <tr key={x._id}>
                <td><strong>{x.firstName} {x.lastName}</strong></td>
                <td>{x.company || "—"}</td>
                <td>{x.email}</td>
                <td>{x.source}</td>
                <td><span className={`badge ${x.status.toLowerCase()}`}>{x.status}</span></td>
                <td className="actions">
                  <button onClick={() => openEdit(x)}>Edit</button>
                  {x.status !== "Converted" && <button onClick={() => convert(x._id)}>Convert</button>}
                  <button className="danger-text" onClick={() => remove(x._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {!data.items.length && <tr><td colSpan="6" className="empty">No leads found.</td></tr>}
          </tbody>
        </table>
      </div>

      <Pagination page={page} pages={data.pages} setPage={setPage} />

      {show && <Modal title={editing ? "Edit Lead" : "Add Lead"} onClose={() => setShow(false)}>
        <form onSubmit={save} className="form-grid">
          <label>First name<input required value={form.firstName} onChange={e => setForm({...form, firstName:e.target.value})}/></label>
          <label>Last name<input value={form.lastName || ""} onChange={e => setForm({...form, lastName:e.target.value})}/></label>
          <label>Email<input required type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})}/></label>
          <label>Phone<input value={form.phone || ""} onChange={e => setForm({...form, phone:e.target.value})}/></label>
          <label>Company<input value={form.company || ""} onChange={e => setForm({...form, company:e.target.value})}/></label>
          <label>Source<select value={form.source} onChange={e => setForm({...form, source:e.target.value})}>{["Website","Referral","Social Media","Advertisement","Cold Call","Other"].map(x=><option key={x}>{x}</option>)}</select></label>
          <label>Status<select value={form.status} onChange={e => setForm({...form, status:e.target.value})}>{["New","Contacted","Qualified","Unqualified","Converted"].map(x=><option key={x}>{x}</option>)}</select></label>
          <label className="full">Notes<textarea value={form.notes || ""} onChange={e => setForm({...form, notes:e.target.value})}/></label>
          <div className="form-actions"><button type="button" onClick={() => setShow(false)}>Cancel</button><button className="primary-btn">Save Lead</button></div>
        </form>
      </Modal>}
    </>
  );
}

function Pagination({ page, pages, setPage }) {
  return <div className="pagination"><button disabled={page <= 1} onClick={() => setPage(page-1)}>Previous</button><span>Page {page} of {pages || 1}</span><button disabled={page >= pages} onClick={() => setPage(page+1)}>Next</button></div>;
}
