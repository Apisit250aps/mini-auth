import { created, success, response, validator } from './response';

abstract class Controller {
  validator = validator;
  response = response;
  created = created;
  success = success;
}

export default Controller;
