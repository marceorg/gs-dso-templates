/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2018. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.filerepo.model.constant;

public final class FRConstants {
	private FRConstants() {
		throw new IllegalAccessError("Constant class");
	}

	// Perfiles
	public static final String FR_UP_ADMINS = "ADMINISTRADOR";
	public static final String FR_UP_MOFANA = "MIDDLEOFFICE_ANALISTA";
	public static final String FR_UP_MOFSUP = "MIDDLEOFFICE_SUPERVISOR";
	public static final String FR_UP_SUSANA = "SUSCRIPCION_ANALISTA";
	public static final String FR_UP_SUSSUP = "SUSCRIPCION_SUPERVISOR";
	public static final String FR_UP_EMIANA = "EMISION_ANALISTA";
	public static final String FR_UP_EMISUP = "EMISION_SUPERVISOR";
	public static final String FR_UP_CONSUL = "CONSULTA";
	// Errores de servicios
	public static final String FR_SER_NER = "NO_ERROR";
	public static final String FR_SER_UNF = "USER_NOT_FOUND";
	public static final String FR_SER_UNA = "USER_NOT_AUTHORIZED";
	public static final String FR_SER_SNA = "SOLI_NOT_AUTHORIZED";
	public static final String FR_SER_VNA = "SOLV_NOT_AUTHORIZED";
	public static final String FR_SER_TNA = "TDOC_NOT_AUTHORIZED";
	public static final String FR_SER_EXE = "EXEC_ERROR";
	public static final String FR_SER_FNF = "FILE_NOT_FOUND";
	public static final String FR_SER_UPE = "UPLOAD_ERROR";
	public static final String FR_SER_FSE = "FILE_SIZE_ERROR";
	// Tipos de Archivos
	public static final String TA_IMG_JPG = "iamge/jpg";
	public static final String TA_IMG_PNG = "image/png";
	public static final String TA_APP_PDF = "application/pdf";
	public static final String TA_APP_OST = "application/octet-stream";
}
