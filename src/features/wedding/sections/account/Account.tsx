'use client';

import { ChevronDown, Copy } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
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
        <span>복사하기</span>
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
        <span className="account-side">{group.side}</span>
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
  const [copyModalOpen, setCopyModalOpen] = useState(false);

  return (
    <section className="section account-section" id="account">
      <span className="section-kicker">ACCOUNT</span>
      <h2>{account.title}</h2>
      <div className="account-card">
        <p className="account-message">{account.message}</p>
        <AccountGroupPanel group={account.groom} onCopied={() => setCopyModalOpen(true)} />
        <AccountGroupPanel group={account.bride} onCopied={() => setCopyModalOpen(true)} />
      </div>
      {copyModalOpen && createPortal(
        <div className="account-copy-modal" role="dialog" aria-modal="true" aria-label="계좌번호 복사 완료">
          <div className="account-copy-dialog">
            <p>계좌번호가 복사되었습니다.</p>
            <button type="button" onClick={() => setCopyModalOpen(false)}>
              확인
            </button>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
