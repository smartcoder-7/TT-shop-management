import { Container } from 'unstated';

const getSubdomain = () => {
  const remainder = window.location.host.split('').join('');
  return remainder ? remainder.split('.')[0] : 'www';
};

class ContextContainer extends Container {
  state = {
    subdomain: getSubdomain(),
  };

  get isMobile() {
    return this.state.subdomain === 'mobile';
  }
}

const contextContainer = new ContextContainer();

export default contextContainer;
