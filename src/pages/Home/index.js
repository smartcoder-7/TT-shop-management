import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import qs from 'qs';

import Layout from 'components/Layout';
import Logo from 'components/Logo';
import EmailSubscribe from 'components/EmailSubscribe';

import styles from './styles.scss';
import contextContainer from 'containers/contextContainer';

class Home extends React.Component {
  scrollRef = React.createRef();

  state = {};

  constructor(props) {
    super(props);

    const { location, history } = props;
    const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true });
    this.state.isMobile = queryParams.mobile !== undefined;

    if (contextContainer.isMobile) {
      history.push('/reserve');
    }
  }

  render() {
    return (
      <Layout className={styles.home}>
        <div data-row>
          <div className={styles.intro} data-col="12">
            <h1>
              <Logo className={styles.logo} theme="pink" />
            </h1>
            <p>The world’s first fully autonomous table tennis court system.</p>

            <Link to="/reserve" data-link>
              Reserve a Table
            </Link>
          </div>
        </div>

        <br />
        <br />
        <br />
        <br />
        <br />
        <br />

        <div data-row>
          <div data-col="12" data-col-landscape="6">
            <br />
            <br />
            <h2>How It Works</h2>
            <br />
            <p>
              A premium table tennis experience within a few clicks. All you
              have to do is choose a time, add your payment information, and
              show up at the&nbsp;door.
            </p>
          </div>
          <div data-col="0" data-col-landscape="6" data-landscape-only>
            <img src="/assets/mobile-screenshot-01.png" />
          </div>
        </div>

        <br />
        <br />
        <br />
        <br ref={this.scrollRef} />
        <br />

        <div data-row>
          <div data-col="0" data-col-landscape="3"></div>
          <div data-col="12" data-col-landscape="6">
            <h2>Get Early Access</h2>
            <br />
            <p></p>
            <br />

            <EmailSubscribe />
          </div>
          <div data-col="0" data-col-landscape="3"></div>
        </div>

        <footer>
          <br />
          <br />
          <div className={styles.content} data-row>
            <div data-col="12">Questions or comments? Get in touch at .</div>
          </div>
          <br />
          <br />
        </footer>
      </Layout>
    );
  }
}

export default withRouter(Home);
