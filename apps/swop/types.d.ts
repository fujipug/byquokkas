import { Timestamp } from "firebase/firestore";

type Offer = {
	id?: string;
	swapId: string;
	sender: string;
	receiver?: string;
	offerA: any[];
	amountA: numberstring;
	offerB?: any[];
	amountB?: numberstring;
	description?: string;
	offerName?: string;
	status: string;
	type: string;
	createdAt: Timestamp;
} & DocumentData;