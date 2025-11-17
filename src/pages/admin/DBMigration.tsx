import { BASE_URL } from "@/config/apiConfig";

const DBMigration = () => {


    const migrateDBLocalToProd = async() => {



        try {
            const url = `${BASE_URL}/api/admin/db-migrate`;
            const res = await fetch(url);
            const data = await res.json();

            console.log(data);
            

        } catch (err) {
            console.log("NO", err);
            
        }






    }



    return (<>

        <button className='mt-44' onClick={migrateDBLocalToProd}>Migrate Bro</button>



    </>)


}

export default DBMigration;