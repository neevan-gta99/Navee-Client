import { useState } from "react";

function Temp() {

    const [files, setFiles] = useState<File[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();

        if (files) {
            files.forEach((file) => {
                formData.append("images", file); // use same key for all
            });
            formData.append("collection", "Men Topwear");
            
        } else {
            console.warn("No file selected");
            return;
        }

        const res = await fetch("http://localhost:6173/api/test/imageUpload", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        console.log("Cloudinary URL:", data.secure_url);
    };


    return (
        <form onSubmit={handleSubmit}>
            <input
                type="file"
                multiple
                onChange={(e) => {
                    const selectedFiles = Array.from(e.target.files || []);
                    setFiles(selectedFiles); // use useState<File[]>
                }}
            />
            <button type="submit">Upload</button>
        </form>
    );
}
export default Temp;
