import labyrintti from '../backends/labyrintti';
import mock from '../backends/mock';

import Config from '../Config';


const backends = { labyrintti, mock };

export const sendMessage = backends[Config.backend];
export default sendMessage;
