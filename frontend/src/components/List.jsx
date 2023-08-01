/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner, Badge, Table } from 'react-bootstrap';
import { Bucket, Heart } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import cn from 'classnames';
import { fetchLoading, selectors } from '../slices/dataSlice.js';
import { ModalDelete } from './Modals.jsx';
import ApiContext from './Context.jsx';
import routes from '../routes.js';

const List = ({ isMobile }) => {
  const dispatch = useDispatch();
  const { addLike, removeLike } = useContext(ApiContext);
  const [modalShow, setModalShow] = useState(false);
  const [currentId, setDeleteId] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchLoading());
  }, [dispatch]);

  const { loadingStatus } = useSelector((state) => state.data);
  const data = useSelector(selectors.selectAll);

  const likesHandler = async (id) => {
    const isLike = localStorage.getItem(`guest_${id}`);
    if (isLike) {
      localStorage.removeItem(`guest_${id}`);
      removeLike(id);
      await axios.get(`${routes.removeLike}${id}`);
    } else {
      window.localStorage.setItem(`guest_${id}`, 'like');
      addLike(id);
      await axios.get(`${routes.addLike}${id}`);
    }
  };

  return loadingStatus !== 'finish'
    ? (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="primary" role="status" />
      </div>
    )
    : (
      <>
        <ModalDelete show={modalShow} onHide={() => setModalShow(false)} id={currentId} />
        {data.sort((a, b) => b.id - a.id).map((guest) => {
          const isLike = localStorage.getItem(`guest_${guest.id}`);
          return (
            <Table key={guest.id} className="mb-3 anim-show" striped bordered hover variant="light">
              <thead>
                <tr className="text-center">
                  <th>{guest.id}</th>
                  <th colSpan={3}>
                    {guest.name}
                  </th>
                  <th>
                    <span
                      role="button"
                      className="position-relative"
                      onClick={() => likesHandler(guest.id)}
                      onKeyDown={() => likesHandler(guest.id)}
                      tabIndex={0}
                      title={t('list.likes')}
                    >
                      <Heart className={cn('fs-3', {
                        'text-danger': isLike,
                        animate__heartBeat: isLike,
                      })}
                      />
                      <Badge
                        bg={cn({
                          secondary: !isLike,
                          danger: isLike,
                        })}
                        className={cn(
                          'position-absolute top-0 start-100 translate-middle',
                          { transition: isLike },
                        )}
                      >
                        {guest.likes}
                      </Badge>
                      <span className="visually-hidden">{t('list.likes')}</span>
                    </span>
                  </th>
                  <th>
                    <Bucket
                      role="button"
                      className={cn('fs-3', {
                        'vertical-align': isMobile,
                      })}
                      onClick={() => {
                        setDeleteId(guest.id);
                        setModalShow(true);
                      }}
                      title={t('list.delete')}
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td />
                  <td>{t('list.phone')}</td>
                  <td colSpan={4}>{guest.phone}</td>
                </tr>
                <tr>
                  <td />
                  <td>{t('list.foods')}</td>
                  <td colSpan={4}>{guest.foods.join(', ')}</td>
                </tr>
                <tr>
                  <td />
                  <td>{t('list.alcohol')}</td>
                  <td colSpan={4}>{guest.alcohol.join(', ')}</td>
                </tr>
                <tr>
                  <td />
                  <td>{t('list.transfer')}</td>
                  <td colSpan={4}>{guest.transfer}</td>
                </tr>
                <tr>
                  <td />
                  <td>{t('list.children')}</td>
                  <td colSpan={4}>{guest.children}</td>
                </tr>
                <tr>
                  <td />
                  <td>{t('list.beds')}</td>
                  <td colSpan={4}>{guest.beds}</td>
                </tr>
                <tr>
                  <td />
                  <td>{t('list.date')}</td>
                  <td colSpan={4}>{guest.createdAt}</td>
                </tr>
              </tbody>
            </Table>
          );
        })}
      </>
    );
};

export default List;
