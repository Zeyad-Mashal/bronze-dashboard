const URL = "https://bronze-back.vercel.app/deleteArticle/";
const DeleteBlog = async (setError, setLoading, setIsDeleteModalOpen, getAllBlogs, id) => {
    setLoading(true)
    try {
        const response = await fetch(`${URL}${id}`, {
            method: 'DELETE',
            // headers: {
            //     "x-is-dashboard": true,
            // },
        });

        const result = await response.json();

        if (response.ok) {
            setIsDeleteModalOpen(false);
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
    }
}
export default DeleteBlog; 