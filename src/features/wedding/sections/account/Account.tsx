'use client';

import { ChevronDown, Copy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { weddingData, type AccountGroup, type AccountPerson } from '@/data/weddingData';

function AccountPersonRow({ person, onCopied }: { person: AccountPerson; onCopied: () => void }) {
  const copyAccount = async () => {
    const text = `${person.bank} ${person.number} (${person.holder})`;
    await navigator.clipboard.writeText(text);
    onCopied();
  };

  return (
    <div className="account-person">
      <div className="account-person-info">
        <strong>{person.relation} {person.holder}</strong>
        <span>{person.bank} {person.number}</span>
      </div>
      <button type="button" className="account-copy" onClick={copyAccount} aria-label={`${person.holder} 계좌 복사`}>
        <Copy aria-hidden />
        <span>복사</span>
      </button>
    </div>
  );
}

function AccountGroupPanel({ group, onCopied }: { group: AccountGroup; onCopied: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = `account-panel-${group.side.replace(/\s+/g, '-')}`;

  return (
    <div className={`account-panel ${isOpen ? 'is-open' : ''}`}>
      <button
        type="button"
        className="account-panel-toggle"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="account-side">{group.side} 계좌번호</span>
        <ChevronDown className="account-chevron" aria-hidden />
      </button>
      <div className="account-panel-body" id={panelId} aria-hidden={!isOpen}>
        <div className="account-panel-body-inner">
          {group.people.map((person) => (
            <AccountPersonRow key={`${group.side}-${person.relation}`} person={person} onCopied={onCopied} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Account() {
  const { account } = weddingData;
  const [copyToastOpen, setCopyToastOpen] = useState(false);
  const toastTimerRef = useRef<number | null>(null);

  const showCopyToast = () => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    setCopyToastOpen(true);
    toastTimerRef.current = window.setTimeout(() => {
      setCopyToastOpen(false);
      toastTimerRef.current = null;
    }, 1500);
  };

  useEffect(() => () => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
  }, []);

  return (
    <section className="section account-section" id="account">
      <span className="section-kicker">ACCOUNT</span>
      <h2>{account.title}</h2>
      <div className="account-card">
        <p className="account-message">{account.message}</p>
        <AccountGroupPanel group={account.groom} onCopied={showCopyToast} />
        <AccountGroupPanel group={account.bride} onCopied={showCopyToast} />
      </div>
      <p className={`account-copy-toast ${copyToastOpen ? 'is-visible' : ''}`} role="status" aria-live="polite">
        복사되었습니다
      </p>
    </section>
  );
}
