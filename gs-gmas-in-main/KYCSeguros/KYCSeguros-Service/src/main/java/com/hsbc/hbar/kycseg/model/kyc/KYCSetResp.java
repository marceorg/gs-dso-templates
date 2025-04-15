/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2013. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.kycseg.model.kyc;

public class KYCSetResp {
	private Integer estadoGra;
	private Integer estadoAsi;
	private EstadoKYC estadoKYC;

	public Integer getEstadoGra() {
		return this.estadoGra;
	}

	public void setEstadoGra(final Integer estadoGra) {
		this.estadoGra = estadoGra;
	}

	public Integer getEstadoAsi() {
		return this.estadoAsi;
	}

	public void setEstadoAsi(final Integer estadoAsi) {
		this.estadoAsi = estadoAsi;
	}

	public EstadoKYC getEstadoKYC() {
		return this.estadoKYC;
	}

	public void setEstadoKYC(final EstadoKYC estadoKYC) {
		this.estadoKYC = estadoKYC;
	}
}
