import { useEffect, useState } from 'react'
import { fetchFees, FeeInfo } from '../lib/api'

export default function Fees() {
  const [data, setData] = useState<FeeInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    fetchFees().then(setData).catch(err => {
      setError(err?.response?.data?.message || 'Failed to load fees')
    })
  }, [])
  const pending = data?.status === 'Pending'
  return (
    <div className="card">
      <h3>Fees</h3>
      <p className="muted">Your package payment details</p>
      {error && <div className="alert">{error}</div>}
      {pending && <div className="alert">Your payment is pending. Please clear dues before the due date.</div>}
      <div>
        <div className="field"><span className="label">Total Amount</span><span className="value">₹{data?.totalAmount ?? '-'}</span></div>
        <div className="field"><span className="label">Paid Amount</span><span className="value">₹{data?.paidAmount ?? '-'}</span></div>
        <div className="field"><span className="label">Pending Amount</span><span className="value">₹{data?.pendingAmount ?? '-'}</span></div>
        <div className="field"><span className="label">Due Date</span><span className="value">{data?.dueDate ? new Date(data.dueDate).toLocaleDateString() : '-'}</span></div>
        <div className="field"><span className="label">Payment Status</span><span className="value">{data?.status ?? '-'}</span></div>
      </div>
    </div>
  )
}
