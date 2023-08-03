// import { useTranslation } from 'react-i18next';
import { Card } from 'react-bootstrap';

//  const { t } = useTranslation();

const Page404 = () => (
  <div className="col-12 col-lg-8">
    <Card border="warning" bg="light" className="text-center">
      <Card.Header>Ошибка 404</Card.Header>
      <Card.Body>
        <Card.Title>Страница не найдена</Card.Title>
        <Card.Text>
          Возможно, наши горе-разработчики что-то сломали :(
        </Card.Text>
      </Card.Body>
    </Card>
  </div>
);

export default Page404;
