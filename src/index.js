import './styles.css';
import { TaskStore } from './store';
import { mountApp } from './ui';

mountApp(document.getElementById('app'), new TaskStore());
