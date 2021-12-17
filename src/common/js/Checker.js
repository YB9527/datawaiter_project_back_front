 function isNull(value){
	 if(value === null || value === undefined || value === ""){
	 	 return true;
	 }
 }

export function checkNull(value,errortip="不能为空"){
	if(isNull(value)){
		return errortip;
	}
}


export function  checkSelectNull(value,errortip="必选"){
	if(isNull(value)){
		return errortip;
	}
}


export function   checkZJHM(value,errortip="证件号码必须是18位"){
	if (isNull(value) || value.length !== 18) {
		return errortip;
	}
}


export function checkPhoneNuber(value,errortip="联系电话必须是11位"){
	if (isNull(value) || value.length !== 11) {
		return errortip;
	}
}


/**
 * 大于0
 */
export function  moreThan0 (value,errortip="值必须大于0"){
	if (isNull(value) || parseInt(value) <= 0) {
		return errortip;
	}
}


export function checkLength(value,{len,errortip}){
	if (isNull(value) || value.length !== len) {
		return errortip?errortip:"长度必须是："+len+"位";
	}
}

