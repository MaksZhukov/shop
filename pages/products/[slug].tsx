import axios from 'axios';
import { GetServerSideProps } from 'next';
import { FC } from 'react';
import { api } from '../../api';
import { fetchProduct } from '../../api/products/products';
import { Product } from '../../api/products/types';

interface Props {
    data: Product;
}

const ProductPage = ({ data }: Props) => {
    return <pre>{JSON.stringify(data, undefined, 2)}</pre>;
};

export const getServerSideProps: GetServerSideProps<{}, { slug: string }> = async (context) => {
    let data = null;
    let notFound = false;
    try {
        const response = await fetchProduct(context.params?.slug || '');
        data = response.data.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            notFound = true;
        }
    }

    return {
        notFound,
        props: { data }
    };
};

export default ProductPage;
