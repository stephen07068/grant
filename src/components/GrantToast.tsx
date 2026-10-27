import { useState, useEffect } from 'react';
import './GrantToast.css';

const NAMES = [
  'Sarah M.', 'James T.', 'Maria L.', 'David K.', 'Ashley R.',
  'Carlos V.', 'Priya S.', 'Michael B.', 'Jennifer W.', 'Tanya H.',
  'Robert F.', 'Linda G.', 'Kevin O.', 'Rachel N.', 'Omar A.',
  'Diana C.', 'Tyler J.', 'Fatima Z.', 'Marcus D.', 'Yolanda P.',
];

const GRANT_TYPES = [
  'Emergency Relief Grant',
  'Housing Assistance Grant',
  'Education & Tuition Grant',
  'Small Business Innovation Grant',
  'Disability Support Grant',
  'Single Parent Family Grant',
  'Veterans Housing Grant',
  'Clean Energy Research Grant',
  'Arts & Culture Fellowship',
  'Youth STEM Challenge Grant',
  'Mental Health Services Grant',
  'Farm Sustainability Grant',
];

const STATES = [
  'Texas', 'California', 'Florida', 'New York', 'Ohio',
  'Georgia', 'Illinois', 'Arizona', 'Michigan', 'North Carolina',
  'Pennsylvania', 'Washington', 'Colorado', 'Nevada', 'Virginia',
];

const AMOUNTS = [20000, 25000, 30000, 35000, 40000, 45000, 50000, 60000, 75000];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatAmount(n: number) {
  return `$${(n / 1000).toFixed(0)}K`;
}

function buildNotification() {
  return {
    name: pick(NAMES),
    state: pick(STATES),
    grant: pick(GRANT_TYPES),
    amount: formatAmount(pick(AMOUNTS)),
    id: Date.now(),
  };
}

export default function GrantToast() {
  const [toast, setToast] = useState<ReturnType<typeof buildNotification> | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show first toast after 4 seconds
    const initial = setTimeout(() => showToast(), 4000);
    return () => clearTimeout(initial);
  }, []);

  function showToast() {
    setToast(buildNotification());
    setVisible(true);

    // Hide after 6 seconds
    const hideTimer = setTimeout(() => {
      setVisible(false);
      // Show next one 30 seconds after it hides
      const nextTimer = setTimeout(() => showToast(), 20000);
      return () => clearTimeout(nextTimer);
    }, 6000);

    return () => clearTimeout(hideTimer);
  }

  if (!toast) return null;

  return (
    <div className={`grant-toast ${visible ? 'grant-toast--in' : 'grant-toast--out'}`}>
      <div className="grant-toast-icon">🏆</div>
      <div className="grant-toast-body">
        <p className="grant-toast-title">Grant Awarded!</p>
        <p className="grant-toast-msg">
          <strong>{toast.name}</strong> from {toast.state} was awarded{' '}
          <span className="grant-toast-amount">{toast.amount}</span> via the{' '}
          <em>{toast.grant}</em>
        </p>
      </div>
    </div>
  );
}
