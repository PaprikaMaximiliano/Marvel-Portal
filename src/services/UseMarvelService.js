import { useHttp } from '../hooks/http.hook';

const useMarvelService = () => {
    const { loading, request, error, clearError } = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey =
        'ts=1&apikey=8229e073f486c74dcfc68279f3ef40be&hash=921d2f6212f917bb3b605612c467e8a1';
    const _baseOffset = 210;

    const getAllCharacters = async (offSet = _baseOffset) => {
        const res = await request(
            `${_apiBase}characters?limit=9&offset=${offSet}&${_apiKey}`
        );
        return res.data.results.map(_transformCharacter);
    };

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    };

    const getAllComics = async (offSet = 0) => {
        const res = await request(
            `${_apiBase}comics?limit=8&offset=${offSet}&${_apiKey}`
        );
        return res.data.results.map(_transformComics);
    };

    const getComic = async (id) => {
        const res = await request(
            `${_apiBase}comics/${id}?&${_apiKey}`
        );
        console.log(_transformComics(res.data.results[0]))
        return _transformComics(res.data.results[0])
    };

    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description
                ? `${char.description.slice(0, 210)}...`
                : 'There is no description for this character',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items,
        };
    };

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description || 'There is no description',
            pageCount: comics.pageCount
                ? `${comics.pageCount} p.`
                : 'No information about the number of pages',
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            language: comics.textObjects[0]?.language || 'en-us',
            price: comics.prices[0].price
                ? `${comics.prices[0].price}`
                : 'not available',
        };
    };

    return {
        loading,
        error,
        getAllCharacters,
        getCharacter,
        getAllComics,
        getComic,
        clearError,
    };
};

export default useMarvelService;
