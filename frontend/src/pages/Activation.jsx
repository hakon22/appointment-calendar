import { Card, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ActivationForm from '../components/ActivationForm.jsx';
import { fetchActivation } from '../slices/loginSlice.js';
import routes from '../routes.js';

const Activation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { loadingStatus } = useSelector((state) => state.login);

  useEffect(() => {
    const needsActivation = async () => {
      const { payload } = await dispatch(fetchActivation(id));
      if (!payload) {
        navigate(routes.notFoundPage);
      }
    };
    needsActivation();
  }, [dispatch, id, navigate]);

  return loadingStatus !== 'finish'
    ? (
      <div className="h-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="primary" role="status" />
      </div>
    )
    : (
      <div className="col-12 col-md-8">
        <Helmet>
          <title>{t('activationForm.title')}</title>
          <meta name="description" content={t('activationForm.submit')} />
          <link rel="canonical" href={window.location.href} />
        </Helmet>
        <Card border="secondary" bg="light" className="text-center">
          <Card.Header className="h4">{t('activationForm.title')}</Card.Header>
          <Card.Body>
            <ActivationForm id={id} />
          </Card.Body>
        </Card>
      </div>
    );
};

export default Activation;
