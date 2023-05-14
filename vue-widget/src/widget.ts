import { Message } from '@lumino/messaging';
import { Widget } from '@lumino/widgets';

import { createApp } from 'vue';
import Counter from './counter.vue';

export class CounterWidget extends Widget {
  constructor() {
    super();
    this.addClass('jp-VueWidget');
  }

  async onUpdateRequest(msg: Message): Promise<void> {
    console.log(msg);
    console.log(this.node);
    createApp(Counter).mount(this.node);
  }
}
