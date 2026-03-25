import { useState, useEffect, useCallback } from 'react';
import { ContactsService } from './generated/services/ContactsService';
import type { Contacts } from './generated/models/ContactsModel';
import './ContactsPage.css';

type ContactFormData = {
  firstname: string;
  lastname: string;
  emailaddress1: string;
  telephone1: string;
  jobtitle: string;
  company: string;
};

const emptyForm: ContactFormData = {
  firstname: '',
  lastname: '',
  emailaddress1: '',
  telephone1: '',
  jobtitle: '',
  company: '',
};

const SELECTED_FIELDS = [
  'contactid',
  'firstname',
  'lastname',
  'emailaddress1',
  'telephone1',
  'jobtitle',
  'company',
];

function ContactsPage() {
  const [contacts, setContacts] = useState<Contacts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ContactFormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await ContactsService.getAll({
        select: SELECTED_FIELDS,
        orderBy: ['lastname asc', 'firstname asc'],
        top: 50,
      });
      setContacts(result.data ?? []);
    } catch (err) {
      console.error('Failed to fetch contacts:', err);
      setError('Failed to load contacts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openCreateForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (contact: Contacts) => {
    setForm({
      firstname: contact.firstname ?? '',
      lastname: contact.lastname ?? '',
      emailaddress1: contact.emailaddress1 ?? '',
      telephone1: contact.telephone1 ?? '',
      jobtitle: contact.jobtitle ?? '',
      company: contact.company ?? '',
    });
    setEditingId(contact.contactid);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.lastname.trim()) {
      setError('Last name is required.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const record: Record<string, string> = {};
      for (const [key, value] of Object.entries(form)) {
        if (value.trim()) record[key] = value.trim();
      }

      if (editingId) {
        await ContactsService.update(editingId, record);
      } else {
        await ContactsService.create(record as unknown as Omit<Contacts, 'address1_addressid'>);
      }
      cancelForm();
      await fetchContacts();
    } catch (err) {
      console.error('Failed to save contact:', err);
      setError(`Failed to ${editingId ? 'update' : 'create'} contact.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (contact: Contacts) => {
    const name = [contact.firstname, contact.lastname].filter(Boolean).join(' ');
    if (!window.confirm(`Delete contact "${name}"?`)) return;

    setError(null);
    try {
      await ContactsService.delete(contact.contactid);
      await fetchContacts();
    } catch (err) {
      console.error('Failed to delete contact:', err);
      setError('Failed to delete contact.');
    }
  };

  return (
    <div className="contacts-page">
      <h1>📇 Contacts</h1>
      <p className="subtitle">Manage your Dataverse contacts</p>

      {error && <div className="contacts-error">{error}</div>}

      {!showForm && (
        <button className="contacts-btn contacts-btn-primary" onClick={openCreateForm}>
          + New Contact
        </button>
      )}

      {showForm && (
        <form className="contacts-form" onSubmit={handleSubmit}>
          <h2>{editingId ? 'Edit Contact' : 'New Contact'}</h2>
          <div className="contacts-form-grid">
            <label>
              First Name
              <input name="firstname" value={form.firstname} onChange={handleChange} />
            </label>
            <label>
              Last Name <span className="required">*</span>
              <input name="lastname" value={form.lastname} onChange={handleChange} required />
            </label>
            <label>
              Email
              <input
                name="emailaddress1"
                type="email"
                value={form.emailaddress1}
                onChange={handleChange}
              />
            </label>
            <label>
              Phone
              <input name="telephone1" type="tel" value={form.telephone1} onChange={handleChange} />
            </label>
            <label>
              Job Title
              <input name="jobtitle" value={form.jobtitle} onChange={handleChange} />
            </label>
            <label>
              Company
              <input name="company" value={form.company} onChange={handleChange} />
            </label>
          </div>
          <div className="contacts-form-actions">
            <button
              type="submit"
              className="contacts-btn contacts-btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving…' : editingId ? 'Save Changes' : 'Create Contact'}
            </button>
            <button
              type="button"
              className="contacts-btn contacts-btn-secondary"
              onClick={cancelForm}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="contacts-loading">Loading contacts…</p>
      ) : contacts.length === 0 ? (
        <p className="contacts-empty">No contacts found. Create one to get started!</p>
      ) : (
        <div className="contacts-table-wrapper">
          <table className="contacts-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Job Title</th>
                <th>Company</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.contactid}>
                  <td>{[c.firstname, c.lastname].filter(Boolean).join(' ')}</td>
                  <td>{c.emailaddress1 ?? '—'}</td>
                  <td>{c.telephone1 ?? '—'}</td>
                  <td>{c.jobtitle ?? '—'}</td>
                  <td>{c.company ?? '—'}</td>
                  <td className="contacts-actions">
                    <button
                      className="contacts-btn contacts-btn-small"
                      onClick={() => openEditForm(c)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="contacts-btn contacts-btn-small contacts-btn-danger"
                      onClick={() => handleDelete(c)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ContactsPage;
