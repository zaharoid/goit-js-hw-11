import axios from 'axios';

const BASE_URL = `https://pixabay.com/api/`;

export default class imgApi {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImgs() {
    const options = {
      params: {
        key: '37265798-a554b97b0d8bd77968a94ecbb',
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: this.page,
      },
    };

    try {
      const response = await axios.get(BASE_URL, options);
      this.incrementPage();

      return await response.data;
    } catch (error) {
      return console.log(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newValue) {
    this.searchQuery = newValue;
  }
}
