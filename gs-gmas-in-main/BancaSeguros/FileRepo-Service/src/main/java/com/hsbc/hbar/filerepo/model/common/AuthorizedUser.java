/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2018. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.filerepo.model.common;

public class AuthorizedUser {
	private String peopleSoft;
	private String fName;
	private String lName;
	private String profileKey;
	private String profileLabel;
	private String profileType;
	private String token;

	public String getPeopleSoft() {
		return this.peopleSoft;
	}

	public void setPeopleSoft(final String peopleSoft) {
		this.peopleSoft = peopleSoft;
	}

	public String getfName() {
		return this.fName;
	}

	public void setfName(final String fName) {
		this.fName = fName;
	}

	public String getlName() {
		return this.lName;
	}

	public void setlName(final String lName) {
		this.lName = lName;
	}

	public String getProfileKey() {
		return this.profileKey;
	}

	public void setProfileKey(final String profileKey) {
		this.profileKey = profileKey;
	}

	public String getProfileLabel() {
		return this.profileLabel;
	}

	public void setProfileLabel(final String profileLabel) {
		this.profileLabel = profileLabel;
	}

	public String getProfileType() {
		return this.profileType;
	}

	public void setProfileType(final String profileType) {
		this.profileType = profileType;
	}

	public String getToken() {
		return this.token;
	}

	public void setToken(final String token) {
		this.token = token;
	}
}
