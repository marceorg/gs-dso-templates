/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2013. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.kycseg.model.common;

public class CPFinder {
	private String codigoPostal;
	private String calle;
	private String alturaDesde;
	private String alturaHasta;

	public String getCodigoPostal() {
		return this.codigoPostal;
	}

	public void setCodigoPostal(final String codigoPostal) {
		this.codigoPostal = codigoPostal;
	}

	public String getCalle() {
		return this.calle;
	}

	public void setCalle(final String calle) {
		this.calle = calle;
	}

	public String getAlturaDesde() {
		return this.alturaDesde;
	}

	public void setAlturaDesde(final String alturaDesde) {
		this.alturaDesde = alturaDesde;
	}

	public String getAlturaHasta() {
		return this.alturaHasta;
	}

	public void setAlturaHasta(final String alturaHasta) {
		this.alturaHasta = alturaHasta;
	}
}
