import './style.css';
import Logger, { LoggerColor } from '../src/Logger';

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <h1>Logger Demo</h1>
  <span>See your console</span>
`;

const logger = Logger.getInstance();

logger.debug('test');
logger.trace('test');
logger.error('test');
logger.warn('test');
logger.log('test', 'group:tag1', LoggerColor.Purple);
logger.log('test', 'group:tag2', LoggerColor.NeonBlue);

console.log(logger.getLogs());

logger.startRecord();

logger.debug('test');
logger.trace('test');
logger.error('test');
logger.warn('test');
logger.log('test', 'group:tag1', LoggerColor.Purple);
logger.log('test', 'group:tag2', LoggerColor.NeonBlue);

logger.stopRecord();

console.log(logger.getLogs());
