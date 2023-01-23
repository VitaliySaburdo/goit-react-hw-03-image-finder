import { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ApiService } from '../ApiService/ApiService';
import { toast } from 'react-toastify';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { LoadButton } from './Button/Button';
import { Modal } from './Modal/Modal';
import Loader from './Loader/Loader';
import PropTypes from 'prop-types';

export class App extends Component {
  state = {
    page: 1,
    query: '',
    items: [],
    largeImageUrl: null,
    showLoadButton: false,
    showModal: false,
    isLoading: false,
    name: '',
  };
  static propTypes = {
    page: PropTypes.number,
    query: PropTypes.string,
    items: PropTypes.array,
    largeImageUrl: PropTypes.string,
    showLoadButton: PropTypes.bool,
    showModal: PropTypes.bool,
    isLoading: PropTypes.bool,
    name: PropTypes.string,
  };

  async componentDidUpdate(_, prevState) {
    const { page, query } = this.state;
    if (prevState.page !== page || prevState.query !== query) {
      try {
        this.setState({
          isLoading: true,
        });
        const cards = await ApiService(query, page);
        if (cards.length) {
          this.setState(prevState => ({
            items: [...prevState.items, ...cards],
            showLoadButton: true,
          }));
        } else {
          toast.warn(`Images ${query} is not found`);
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.setState({
          isLoading: false,
        });
      }
    }
  }

  toggleModal = () => {
    this.setState(({ showModal }) => ({ showModal: !showModal }));
  };

  onClickImage = (url, name) => {
    this.setState({ largeImageUrl: url });
    this.setState({ name: name });
    this.setState({ showModal: true });
  };

  LoadMore = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  formSubmitHendler = ({ query }) => {
    this.setState({ page: 1, query, items: [], showLoadButton: false });
  };

  render() {
    const { items, showLoadButton, largeImageUrl, showModal, isLoading, name } =
      this.state;
    return (
      <div>
        <Searchbar onSubmit={this.formSubmitHendler} />
        <ToastContainer />

        <ImageGallery cards={items} onSelect={this.onClickImage} />

        {isLoading && <Loader />}
        {showModal && (
          <Modal url={largeImageUrl} name={name} onClose={this.toggleModal} />
        )}
        {showLoadButton && <LoadButton LoadMore={() => this.LoadMore()} />}
      </div>
    );
  }
}