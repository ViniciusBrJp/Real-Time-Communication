import axios from 'axios';
import { RoomId } from '../Types/RoomId';
import URL from '../components/Home';




export const fetchData = () => {
    return axios.get(`${URL}/data-endpoint`);
};

export const createData = (data: RoomId) => {
    return axios.post(`${URL}/data-endpoint`, data);
};

export const updateData = (id: number, data: RoomId) => {
    return axios.put(`${URL}/data-endpoint/${id}`, data);
};

export const deleteData = (id: number) => {
    return axios.delete(`${URL}/data-endpoint/${id}`);
};
