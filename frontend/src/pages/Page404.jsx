import { useTranslation } from 'react-i18next';
import { Card, Image } from 'react-bootstrap';
import lemon from '../images/lemon.svg';

const Page404 = () => {
  const { t } = useTranslation();
  return (
    <div className="col-12 col-md-8">
      <Card border="warning" bg="light" className="text-center">
        <Card.Header>{t('404.header')}</Card.Header>
        <Card.Body>
          <Image className="mt-3 mb-4" src={lemon} alt={t('404.header')} roundedCircle />
          <Card.Title>{t('404.title')}</Card.Title>
          <Card.Text>
            {t('404.text')}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Page404;
