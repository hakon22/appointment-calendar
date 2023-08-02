// import { useTranslation } from 'react-i18next';
import { Card } from 'react-bootstrap';

//  const { t } = useTranslation();

const Page404 = () => (
  <Card border="warning" className="w-50 text-center">
    <Card.Header>Ошибка 404</Card.Header>
    <Card.Body>
      <Card.Title>Страница не найдена</Card.Title>
      <Card.Text>
        Возможно, наши горе-разработчики что-то сломали :(
      </Card.Text>
    </Card.Body>
  </Card>
);

export default Page404;
