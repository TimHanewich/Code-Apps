import { useEffect, useState } from 'react'
import { ContactsService } from './generated/services/ContactsService'
import type { Contacts } from './generated/models/ContactsModel'
import './App.css'

function App() {
  const [contacts, setContacts] = useState<Contacts[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContacts = async () => {
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
    }

    fetchContacts()
  }, [])

  if (loading) {
    return <div className="status-message">Loading contacts…</div>
  }

  if (error) {
    return <div className="status-message error">Error: {error}</div>
  }

  return (
    <div className="contacts-container">
      <h1>Contacts</h1>
      {contacts.length === 0 ? (
        <p className="status-message">No contacts found.</p>
      ) : (
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
