// !!!!!!!!!!!!
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createApp } from '@/jsxCore/core';
import './CsatPoll.scss';
import { CSATPoll } from './CsatPoll';
// !!!!!!!!!!!!
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ComponentProps, JsxNode, JsxTextNode } from '@/jsxCore/types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const IframeCSATPoll = (props: ComponentProps): JsxNode[] => {
  return (
    <div class="iframe-wrapper">
      <div class="iframe-header">
        <button
          class="close-button"
          onclick={() => window.parent.postMessage('close-iframe', '*')}
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <CSATPoll key="csat_poll" />
    </div>
  );
};
