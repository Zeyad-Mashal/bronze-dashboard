const URL = "https://bronze-back.vercel.app/addArticle";
const AddBlog = async (data, setError, setLoading, setIsModalOpen, getAllBlogs) => {
    setLoading(true)
    try {
        const response = await fetch(URL, {
            method: 'POST',
            body: data
        });

        const result = await response.json();

        if (response.ok) {
            setIsModalOpen(false);
            setLoading(false)
            getAllBlogs()
        } else {
            if (response.status == 400) {
                setError(result.message);
                setLoading(false)
                console.log(result.message);
            } else if (response.status == 403) {
                setError(result.message);
                setLoading(false)
            } else {
                setError(result.message);
                setLoading(false)
            }
        }
    } catch (error) {
        setError('An error occurred');
        setLoading(false)
        console.log(error.message);

    }
}
export default AddBlog;