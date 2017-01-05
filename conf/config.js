/**
 * Created by Me1kro on 16/12/15.
 */
import Env from './env';
module.exports = {
    porxy: {
        base: Env != 'production' ? './CloudMonitor' : '.'
    }

};