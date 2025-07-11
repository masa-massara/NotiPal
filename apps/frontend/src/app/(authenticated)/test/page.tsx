import { apiClient as hc } from "@/lib/apiClient";
import { idTokenAtom } from "@/store/globalAtoms";
import { store } from "@/store/store";

const idToken = store.get(idTokenAtom);

const page = async () => {
	const res = await hc.destinations.$get({
		headers: {
			Authorization: `Bearer ${idToken}`,
		},
	});
	console.log(res);
	return <div>page</div>;
};

export default page;
