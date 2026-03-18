import { useCallback, useEffect, useState } from 'react'
import { ContactsService } from './generated/services/ContactsService'
import type { Contacts, ContactsBase } from './generated/models/ContactsModel'
import './App.css'

type View = 'list' | 'create'

const EMPTY_FORM = {
  firstname: '',
  lastname: '',
  emailaddress1: '',
  telephone1: '',
  jobtitle: '',
  address1_city: '',
}

function App() {
  const [contacts, setContacts] = useState<Contacts[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<View>('list')
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)

  const fetchContacts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await ContactsService.getAll({
        select: [
          'contactid',
          'firstname',
          'lastname',
          'emailaddress1',
          'telephone1',
          'jobtitle',
          'address1_city',
        ],
        orderBy: ['lastname asc', 'firstname asc'],
      })
      setContacts(result.data ?? [])
    } catch (err) {
      console.error('Failed to fetch contacts:', err)
      setError(err instanceof Error ? err.message : 'Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const record: Partial<Omit<ContactsBase, 'address1_addressid'>> = {
        ...form,
        statecode: 0 as ContactsBase['statecode'],
      }
      // Remove empty optional fields
      for (const [key, val] of Object.entries(record)) {
        if (val === '') delete (record as Record<string, unknown>)[key]
      }
      await ContactsService.create(record as Omit<ContactsBase, 'address1_addressid'>)
      setForm(EMPTY_FORM)
      setView('list')
      fetchContacts()
    } catch (err) {
      console.error('Failed to create contact:', err)
      setError(err instanceof Error ? err.message : 'Failed to create contact')
    } finally {
      setSubmitting(false)
    }
  }

  // ---------- Create form ----------
  if (view === 'create') {
    return (
      <div className="contacts-container">
        <h1>New Contact</h1>
        {error && <div className="status-message error">Error: {error}</div>}
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            First Name
            <input name="firstname" value={form.firstname} onChange={handleFieldChange} />
          </label>
          <label>
            Last Name <span className="required">*</span>
            <input name="lastname" value={form.lastname} onChange={handleFieldChange} required />
          </label>
          <label>
            Email
            <input name="emailaddress1" type="email" value={form.emailaddress1} onChange={handleFieldChange} />
          </label>
          <label>
            Phone
            <input name="telephone1" type="tel" value={form.telephone1} onChange={handleFieldChange} />
          </label>
          <label>
            Job Title
            <input name="jobtitle" value={form.jobtitle} onChange={handleFieldChange} />
          </label>
          <label>
            City
            <input name="address1_city" value={form.address1_city} onChange={handleFieldChange} />
          </label>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save Contact'}
            </button>
            <button type="button" className="btn" onClick={() => { setForm(EMPTY_FORM); setError(null); setView('list') }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  }

  // ---------- List view ----------
  return (
    <div className="contacts-container">
      <div className="toolbar">
        <h1>Contacts</h1>
        <div className="toolbar-actions">
          <button className="btn" onClick={fetchContacts} disabled={loading}>
            {loading ? 'Refreshing…' : '↻ Refresh'}
          </button>
          <button className="btn btn-primary" onClick={() => { setError(null); setView('create') }}>
            + New Contact
          </button>
        </div>
      </div>

      {loading && <div className="status-message">Loading contacts…</div>}
      {error && <div className="status-message error">Error: {error}</div>}

      {!loading && !error && contacts.length === 0 && (
        <p className="status-message">No contacts found.</p>
      )}

      {!loading && contacts.length > 0 && (
        <table className="contacts-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Job Title</th>
              <th>City</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.contactid}>
                <td>{[contact.firstname, contact.lastname].filter(Boolean).join(' ')}</td>
                <td>{contact.emailaddress1 ?? '—'}</td>
                <td>{contact.telephone1 ?? '—'}</td>
                <td>{contact.jobtitle ?? '—'}</td>
                <td>{contact.address1_city ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default App
