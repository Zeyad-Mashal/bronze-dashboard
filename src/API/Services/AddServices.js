const URL = "https://bronze-back.vercel.app/addService";
const AddServices = async (data, setError, setLoading, setIsModalOpen, getAllServices) => {
    setLoading(true)
    try {
        const response = await fetch(URL, {
            method: 'POST',
            // headers: {
            //     "x-is-dashboard": true,
            // },
            body: data
        });

        const result = await response.json();

        if (response.ok) {
            setIsModalOpen(false);
            setLoading(false)
            getAllServices()
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
export default AddServices;