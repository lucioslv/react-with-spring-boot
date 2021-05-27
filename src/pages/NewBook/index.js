import React, {useState, useEffect } from 'react';
import { useHistory, Link, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import api from '../../services/api'
import './styles.css';
import logoImg from '../../assets/logo.svg';

export default function NewBook(){

    const [id, setId] = useState(null);
    const [author, setAuthor] = useState('');
    const [launch_date, setLaunchDate] = useState('');
    const [price, setPrice] = useState('');
    const [title, setTitle] = useState('');

    const {bookId} = useParams();

    const accessToken = localStorage.getItem('accessToken');

    const history = useHistory();

    async function loadBook(){
        try {
            const response = await api.get(`api/book/v1/${bookId}`, { 
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            let adjustedDate = response.data.launch_date.split("T", 10)[0];
            setId(response.data.id);
            setTitle(response.data.title);
            setAuthor(response.data.author);
            setPrice(response.data.price);
            setLaunchDate(adjustedDate);
        } catch (error) {
            alert('Error recovering Book! Try again!');
            history.push('/books');
        }
    }

    useEffect(() => {
        if(bookId === '0') return;
        else loadBook();
    }, [bookId])

    async function saveOrUpdate(e){
        e.preventDefault();

        const data = {
            title,
            author,
            launch_date,
            price
        };

        try {
            if(bookId === '0'){
                await api.post('api/book/v1', data, { 
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
            }else{
                data.id = id;
                await api.put('api/book/v1', data, { 
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
            }
            
            history.push('/books');
        } catch (error) {
            alert('Erro while recording Book! Try again!');
        }

    }

    return (
        <div className="new-book-container">
            <div className="content">
                <section className="form">
                    <img src={logoImg} alt="Logo"/>
                    <h1>{bookId === '0' ? 'Add New' : 'Update'} Book</h1>
                    <p>Enter the book information and click on {bookId === '0' ? "'Add'" : "'Update'"}!</p>
                    <Link className="back-link" to="/books">
                        <FiArrowLeft size={16} color="#251FC5"/>
                        Back to Books
                    </Link>
                </section>
                <form onSubmit={saveOrUpdate}>
                    <input 
                        placeholder="Title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <input 
                        placeholder="Author"
                        value={author}
                        onChange={e => setAuthor(e.target.value)}
                        />
                    <input 
                        type="date"
                        value={launch_date}
                        onChange={e => setLaunchDate(e.target.value)}
                        />    
                    <input 
                        placeholder="Price"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                    />
                    <button className="button" type="submit">{bookId === '0' ? 'Add' : 'Update'}</button>
                </form>
            </div>
        </div>
    );
}