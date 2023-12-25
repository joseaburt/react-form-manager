import { EventBus, UnSubscribe } from '../contracts/state';

export default class FormEventBus implements EventBus {
  private bus: Record<string, Function[]> = {};

  constructor() {
    this.off = this.off.bind(this);
    this.dispatch = this.dispatch.bind(this);
    this.listen = this.listen.bind(this);
    this.once = this.once.bind(this);
    this.getAllListenersFromEvent = this.getAllListenersFromEvent.bind(this);
  }

  public off(event: string, handler: Function): void {
    const index = this.bus[event]?.indexOf(handler) ?? -1;
    this.bus[event]?.splice(index >>> 0, 1);
  }

  public listen(event: string, handler: Function): UnSubscribe {
    if (typeof handler !== 'function') throw new Error('InvalidEventHandlerType');
    if (this.bus[event] === undefined) this.bus[event] = [];
    this.bus[event].push(handler);
    return () => this.off(event, handler);
  }

  public dispatch(event: string, payload?: unknown): void {
    const handlers = this.getAllListenersFromEvent(event);
    for (const handler of handlers) handler(payload);
  }

  public once(event: string, handler: Function): void {
    const handlerOnce = (payload: unknown) => {
      handler(payload);
      this.off(event, handlerOnce);
    };
    this.listen(event, handlerOnce);
  }

  public getAllListenersFromEvent(event: string): Function[] {
    if (this.bus[event] === undefined) return [];
    return this.bus[event];
  }
}
