import { Button, Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import ApiContext from './Context.jsx';
import routes from '../routes.js';

const notify = (text, type) => toast[type](text);

export const ModalDelete = ({ show, onHide, id }) => {
  const { removeData } = useContext(ApiContext);
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {},
    onSubmit: async () => {
      try {
        const res = await axios.delete(`${routes.delete}${id}`);
        if (res.status === 201) {
          removeData(id);
          onHide();
          notify(t('toast.guest_remove'), 'success');
        } else {
          notify(t('toast.error'), 'error');
        }
      } catch (e) {
        notify(t('toast.error'), 'error');
      }
    },
  });

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">{t('modal.body')}</p>
        <div className="d-flex justify-content-end">
          <Form
            onSubmit={formik.handleSubmit}
          >
            <Button className="me-2" variant="secondary" onClick={onHide}>
              {t('modal.close')}
            </Button>
            <Button
              variant="danger"
              type="submit"
              disabled={formik.isSubmitting}
            >
              {t('modal.delete')}
            </Button>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export const ModalSuccess = ({ show, onHide }) => {
  const { t } = useTranslation();

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.success.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">{t('modal.success.body')}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {t('modal.close')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
