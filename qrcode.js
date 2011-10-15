//!/usr/local/bin/ruby
//
// QRcode class library for ruby version 0.50beta6  (c)2002-2004 Y.Swetake
//
//

/*
 for JavaScript by ma.la / (2005/10)
 http://la.ma.la/misc/qrcode/
*/

nil = null;

function Qrcode(){
	this.initialize.apply(this,arguments)
}

(function(Qrcode){
	var charcode = [];
	for(var i=0;i<65536;i++){
		charcode[i] = String.fromCharCode(i);
	}
	Qrcode.charcode = charcode;
})(Qrcode);

Qrcode.prototype.extend({

initialize : function(){
	this.path="./qrcode_data"

	this.qrcode_error_correct="M"
	this.qrcode_version=0

	this.qrcode_structureappend_n=0
	this.qrcode_structureappend_m=0
	this.qrcode_structureappend_parity=""
	this.qrcode_structureappend_originaldata=""
},


string_bit_cal : function(s1,s2,ind){
	if (s1.length>s2.length){
		s3=s1
		s1=s2
		s2=s3
	}
	i=0
	res=""
	left_length=s2.length-s1.length
	
	switch(ind){
	 case "xor" :
		s1.each_byte(function(b){
			res += Qrcode.charcode[(b ^ s2.charCodeAt(i))]
			i += 1
		})
		res += s2[s1.length,left_length]
		break
	  case "or" :
		s1.each_byte(function(b){
			res += Qrcode.charcode[(b | s2.charCodeAt(i))]
			i += 1
		})
		res += s2[s1.length,left_length]
		break
	  case "and" :
		s1.each_byte(function(b){
			res += Qrcode.charcode[(b & s2.charCodeAt(i))]
			i += 1
		})
		res += Qrcode.charcode[(0)].x(left_length)
		break
	}
//	alert("res" + res.unpack("C*"));

	return(res)
},


string_bit_not : function(s1){
	res=""
	s1.each_byte(function(b){res += Qrcode.charcode[(256 + ~b)]})
	return(res)
},


set_qrcode_version : function(z){
	if (z>=0 && z<=40) 
		this.qrcode_version=z
},

set_qrcode_error_correct : function(z){
	this.qrcode_error_correct=z
},


get_qrcode_version : function(){
	return this.qrcode_version
},


set_structureappend : function(m,n,p){
	if (n>1 && n<=16 && m>0 && m<=16 && p>=0 && p<=255){
		this.qrcode_structureappend_m=m
		this.qrcode_structureappend_n=n
		this.qrcode_structureappend_parity=p
	}
},


cal_structureappend_parity : function(originaldata){
	if (originaldata.length>1) {
		structureappend_parity=0
		originaldata.each_byte(function(b){structureappend_parity^=b})
		return structureappend_parity
	}
},

make_qrcode : function(qrcode_data_string){
    var data_length, data_counter, data_value, data_bits, codeword_num_plus, codeword_num_counter_value, i, alphanumeric_character_hash, total_data_bits, ecc_character_hash, ec, max_data_bits_array, j, max_data_bits, max_codewords_array, max_codewords, max_modules_1side, matrix_remain_bit, byte_num, filename, fp, matx, maty, masks, fi_x, fi_y, rs_ecc_codewords, rso, matrix_x_array, matrix_y_array, mask_array, rs_block_order, format_information_x2, format_information_y2, format_information_x1, format_information_y1, max_data_codewords, rs_cal_table_array, frame_data, codewords_counter, codewords, remaining_bits, buffer, buffer_bits, flag, rs_block_number, rs_temp, rs_block_order_num, rs_codewords, rs_data_codewords, rstemp, first, left_chr, cal, matrix_content, codeword_i, codeword_bits_number, matrix_remain, remain_bit_temp, min_demerit_score, hor_master, ver_master, k, l, all_matrix, demerit_n1, ptn_temp, bit, bit_r, bit_mask, hor, ver, ver_and, ver_or, n1_search, n2_search1, n2_search2, n3_search, n4_search, hor_temp, demerit_n3, demerit_n4, demerit_n2, demerit_score, mask_number, mask_content, format_information_value, format_information_array, content, out, mxe;
    data_length = qrcode_data_string.length;
    if (data_length <= 0) {
        throw "Data do not exist";
        return 0;
    }
    data_counter = 0;
    data_value = [];
    data_bits = [];
    if (this.qrcode_structureappend_n > 1) {
        data_value[0] = 3;
        data_bits[0] = 4;
        data_value[1] = this.qrcode_structureappend_m - 1;
        data_bits[1] = 4;
        data_value[2] = this.qrcode_structureappend_n - 1;
        data_bits[2] = 4;
        data_value[3] = this.qrcode_structureappend_parity;
        data_bits[3] = 8;
        data_counter = 4;
    }
    data_bits[data_counter] = 4;
    if (/[^0-9]/.test(qrcode_data_string)) {
        if (/[^0-9A-Z \$\*\%\+\-\.\/\:]/.test(qrcode_data_string)) {
            codeword_num_plus = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8];
            data_value[data_counter] = 4;
            data_counter += 1;
            data_value[data_counter] = data_length;
            data_bits[data_counter] = 8;
            codeword_num_counter_value = data_counter;
            data_counter += 1;
            i = 0;
            while (i < data_length) {
                data_value[data_counter] = qrcode_data_string.charCodeAt(i);
                data_bits[data_counter] = 8;
                data_counter += 1;
                i += 1;
            }
        } else {
            codeword_num_plus = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];
            data_value[data_counter] = 2;
            data_counter += 1;
            data_value[data_counter] = data_length;
            data_bits[data_counter] = 9;
            codeword_num_counter_value = data_counter;
            alphanumeric_character_hash = {'0':0, '1':1, '2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, A:10, B:11, C:12, D:13, E:14, F:15, G:16, H:17, I:18, J:19, K:20, L:21, M:22, N:23, O:24, P:25, Q:26, R:27, S:28, T:29, U:30, V:31, W:32, X:33, Y:34, Z:35, ' ':36, $:37, '%':38, '*':39, '+':40, '-':41, '.':42, '/':43, ':':44};
            i = 0;
            data_counter += 1;
            while (i < data_length) {
                if ((i % 2) == 0) {
                    data_value[data_counter] = alphanumeric_character_hash[qrcode_data_string.ruby_slice(i, 1)];
                    data_bits[data_counter] = 6;
                } else {
                    data_value[data_counter] = data_value[data_counter] * 45 + alphanumeric_character_hash[qrcode_data_string.ruby_slice(i, 1)];
                    data_bits[data_counter] = 11;
                    data_counter += 1;
                }
                i += 1;
            }
        }
    } else {
        codeword_num_plus = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];
        data_value[data_counter] = 1;
        data_counter += 1;
        data_value[data_counter] = data_length;
        data_bits[data_counter] = 10;
        codeword_num_counter_value = data_counter;
        i = 0;
        data_counter += 1;
        while (i < data_length) {
            if ((i % 3) == 0) {
                data_value[data_counter] = qrcode_data_string.ruby_slice(i, 1).to_i();
                data_bits[data_counter] = 4;
            } else {
                data_value[data_counter] = data_value[data_counter] * 10 + qrcode_data_string.ruby_slice(i, 1).to_i();
                if ((i % 3) == 1) {
                    data_bits[data_counter] = 7;
                } else {
                    data_bits[data_counter] = 10;
                    data_counter += 1;
                }
            }
            i += 1;
        }
    }
    if (typeof data_bits[data_counter] == "undefined") {
    } else {
        if (data_bits[data_counter] > 0) {
            data_counter += 1;
        }
    }
    i = 0;
    total_data_bits = 0;
    while (i < data_counter) {
        total_data_bits += data_bits[i];
        i += 1;
    }
    ecc_character_hash = {L:1, l:1, M:0, m:0, Q:3, q:3, H:2, h:2};
    ec = ecc_character_hash[this.qrcode_error_correct];
    if (!ec) {
        ec = 0;
    }
    max_data_bits_array = [0, 128, 224, 352, 512, 688, 864, 992, 1232, 1456, 1728, 2032, 2320, 2672, 2920, 3320, 3624, 4056, 4504, 5016, 5352, 5712, 6256, 6880, 7312, 8000, 8496, 9024, 9544, 10136, 10984, 11640, 12328, 13048, 13800, 14496, 15312, 15936, 16816, 17728, 18672, 152, 272, 440, 640, 864, 1088, 1248, 1552, 1856, 2192, 2592, 2960, 3424, 3688, 4184, 4712, 5176, 5768, 6360, 6888, 7456, 8048, 8752, 9392, 10208, 10960, 11744, 12248, 13048, 13880, 14744, 15640, 16568, 17528, 18448, 19472, 20528, 21616, 22496, 23648, 72, 128, 208, 288, 368, 480, 528, 688, 800, 976, 1120, 1264, 1440, 1576, 1784, 2024, 2264, 2504, 2728, 3080, 3248, 3536, 3712, 4112, 4304, 4768, 5024, 5288, 5608, 5960, 6344, 6760, 7208, 7688, 7888, 8432, 8768, 9136, 9776, 10208, 104, 176, 272, 384, 496, 608, 704, 880, 1056, 1232, 1440, 1648, 1952, 2088, 2360, 2600, 2936, 3176, 3560, 3880, 4096, 4544, 4912, 5312, 5744, 6032, 6464, 6968, 7288, 7880, 8264, 8920, 9368, 9848, 10288, 10832, 11408, 12016, 12656, 13328];
    if (this.qrcode_version == 0) {
        i = 1 + 40 * ec;
        j = i + 39;
        this.qrcode_version = 1;
        while (i <= j) {
            if ((max_data_bits_array[i]) >= total_data_bits + codeword_num_plus[this.qrcode_version]) {
                max_data_bits = max_data_bits_array[i];
                break;
            }
            i += 1;
            this.qrcode_version += 1;
        }
    } else {
        max_data_bits = max_data_bits_array[this.qrcode_version + 40 * ec];
    }
    total_data_bits += codeword_num_plus[this.qrcode_version];
    data_bits[codeword_num_counter_value] += codeword_num_plus[this.qrcode_version];
    max_codewords_array = [0, 26, 44, 70, 100, 134, 172, 196, 242, 292, 346, 404, 466, 532, 581, 655, 733, 815, 901, 991, 1085, 1156, 1258, 1364, 1474, 1588, 1706, 1828, 1921, 2051, 2185, 2323, 2465, 2611, 2761, 2876, 3034, 3196, 3362, 3532, 3706];
    max_codewords = max_codewords_array[this.qrcode_version];
    max_modules_1side = 17 + (this.qrcode_version << 2);
    matrix_remain_bit = [0, 0, 7, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0];
    try {
        byte_num = matrix_remain_bit[this.qrcode_version] + (max_codewords << 3);
        filename = this.path + "/qrv" + this.qrcode_version.to_s() + "_" + ec.to_s() + ".dat";
        fp = File.open(filename, "rb_bin");
        matx = fp.read(byte_num);
        maty = fp.read(byte_num);
        masks = fp.read(byte_num);
        fi_x = fp.read(15);
        fi_y = fp.read(15);
        rs_ecc_codewords = fp.read(1).unpack("C")[0];
        rso = fp.read(128);
        matrix_x_array = matx.unpack("C*");
        matrix_y_array = maty.unpack("C*");
        mask_array = masks.unpack("C*");
        rs_block_order = rso.unpack("C*");
        format_information_x2 = fi_x.unpack("C*");
        format_information_y2 = fi_y.unpack("C*");
        format_information_x1 = [0, 1, 2, 3, 4, 5, 7, 8, 8, 8, 8, 8, 8, 8, 8];
        format_information_y1 = [8, 8, 8, 8, 8, 8, 8, 8, 7, 5, 4, 3, 2, 1, 0];
        max_data_codewords = (max_data_bits >> 3);
        filename = this.path + "/rsc" + rs_ecc_codewords.to_s() + ".dat";
        fp = File.open(filename, "rb_bin");
        i = 0;
        rs_cal_table_array = [];
        while (i < 256) {
            rs_cal_table_array[i] = fp.read(rs_ecc_codewords);
            i += 1;
        }
        filename = this.path + "/qrvfr" + this.qrcode_version.to_s() + ".dat";
        fp = File.open(filename, "rb");
        frame_data = fp.read(65535);
    } catch (e) {
        throw e;
    }
    if (total_data_bits <= max_data_bits - 4) {
        data_value[data_counter] = 0;
        data_bits[data_counter] = 4;
    } else {
        if (total_data_bits < max_data_bits) {
            data_value[data_counter] = 0;
            data_bits[data_counter] = max_data_bits - total_data_bits;
        } else {
            if (total_data_bits > max_data_bits) {
                throw "Overflow error";
                return 0;
            }
        }
    }
    i = 0;
    codewords_counter = 0;
    codewords = [];
    codewords[0] = 0;
    remaining_bits = 8;
    while ((i <= data_counter)) {
        buffer = data_value[i];
        buffer_bits = data_bits[i];
        flag = 1;
        while (flag != 0) {
            if (remaining_bits > buffer_bits) {
                if (codewords[codewords_counter] == nil) {
                    codewords[codewords_counter] = 0;
                }
                codewords[codewords_counter] = ((codewords[codewords_counter] << buffer_bits) | buffer);
                remaining_bits -= buffer_bits;
                flag = 0;
            } else {
                buffer_bits -= remaining_bits;
                codewords[codewords_counter] = ((codewords[codewords_counter] << remaining_bits) | (buffer >> buffer_bits));
                if (buffer_bits == 0) {
                    flag = 0;
                } else {
                    buffer = (buffer & ((1 << buffer_bits) - 1));
                    flag = 1;
                }
                codewords_counter += 1;
                if (codewords_counter < max_data_codewords - 1) {
                    codewords[codewords_counter] = 0;
                }
                remaining_bits = 8;
            }
        }
        i += 1;
    }
    if (remaining_bits != 8) {
        codewords[codewords_counter] = codewords[codewords_counter] << remaining_bits;
    } else {
        codewords_counter -= 1;
    }
    if (codewords_counter < max_data_codewords - 1) {
        flag = 1;
        while (codewords_counter < max_data_codewords - 1) {
            codewords_counter += 1;
            if (flag == 1) {
                codewords[codewords_counter] = 236;
            } else {
                codewords[codewords_counter] = 17;
            }
            flag = flag * (-1);
        }
    }
    i = 0;
    j = 0;
    rs_block_number = 0;
    rs_temp = [];
    rs_temp[0] = "";
    while (i < max_data_codewords) {
        rs_temp[rs_block_number] += Qrcode.charcode[codewords[i]];
        j += 1;
        if (j >= rs_block_order[rs_block_number] - rs_ecc_codewords) {
            j = 0;
            rs_block_number += 1;
            rs_temp[rs_block_number] = "";
        }
        i += 1;
    }
    rs_block_number = 0;
    rs_block_order_num = rs_block_order.length;
    while (rs_block_number < rs_block_order_num) {
        rs_codewords = rs_block_order[rs_block_number];
        rs_data_codewords = rs_codewords - rs_ecc_codewords;
        rstemp = rs_temp[rs_block_number];
        j = rs_data_codewords;
        while (j > 0) {
            first = rstemp.charCodeAt(0);
            if (first != 0) {
                left_chr = rstemp.ruby_slice(1, rstemp.length - 1);
                cal = rs_cal_table_array[first];
                rstemp = this.string_bit_cal(left_chr, cal, "xor");
            } else {
                rstemp = rstemp.ruby_slice(1, rstemp.length - 1);
            }
            j -= 1;
        }
        codewords = codewords.concat(rstemp.unpack("C*"));
        rs_block_number += 1;
    }
    matrix_content = (new Range(0, max_modules_1side, true)).collect((function () {return (new Array(max_modules_1side)).fill(0);}));
    i = 0;
    while (i < max_codewords) {
        codeword_i = codewords[i];
        j = 7;
        while (j >= 0) {
            codeword_bits_number = (i << 3) + j;
            matrix_content[matrix_x_array[codeword_bits_number]][matrix_y_array[codeword_bits_number]] = ((255 * (codeword_i & 1)) ^ mask_array[codeword_bits_number]);
            codeword_i = codeword_i >> 1;
            j -= 1;
        }
        i += 1;
    }
    matrix_remain = matrix_remain_bit[this.qrcode_version];
    while (matrix_remain > 0) {
        remain_bit_temp = matrix_remain + (max_codewords << 3) - 1;
        matrix_content[matrix_x_array[remain_bit_temp]][matrix_y_array[remain_bit_temp]] = (255 ^ mask_array[remain_bit_temp]);
        matrix_remain -= 1;
    }
    min_demerit_score = 0;
    hor_master = "";
    ver_master = "";
    k = 0;
    while (k < max_modules_1side) {
        l = 0;
        while (l < max_modules_1side) {
            hor_master += Qrcode.charcode[matrix_content[l][k].to_int()];
            ver_master += Qrcode.charcode[matrix_content[k][l].to_int()];
            l += 1;
        }
        k += 1;
    }
    i = 0;
    all_matrix = max_modules_1side * max_modules_1side;
    while (i < 8) {
        demerit_n1 = 0;
        ptn_temp = [];
        bit = 1 << i;
        bit_r = (~bit) & 255;
        bit_mask = Qrcode.charcode[bit].x(all_matrix);
        hor = this.string_bit_cal(hor_master, bit_mask, "and");
        ver = this.string_bit_cal(ver_master, bit_mask, "and");
        ver_and = this.string_bit_cal(((Qrcode.charcode[(170)].x(max_modules_1side)) + ver), (ver + (Qrcode.charcode[(170)].x(max_modules_1side))), "and");
        ver_or = this.string_bit_cal(((Qrcode.charcode[(170)].x(max_modules_1side)) + ver), (ver + (Qrcode.charcode[(170)].x(max_modules_1side))), "or");
        hor = this.string_bit_not(hor);
        ver = this.string_bit_not(ver);
        ver_and = this.string_bit_not(ver_and);
        ver_or = this.string_bit_not(ver_or);
        ver_and = ver_and.ruby_slice(all_matrix, 0).eq(Qrcode.charcode[(170)]);
        ver_or = ver_or.ruby_slice(all_matrix, 0).eq(Qrcode.charcode[(170)]);
        k = max_modules_1side - 1;
        while (k >= 0) {
            hor = hor.ruby_slice(k * max_modules_1side, 0).eq(Qrcode.charcode[(170)]);
            ver = ver.ruby_slice(k * max_modules_1side, 0).eq(Qrcode.charcode[(170)]);
            ver_and = ver_and.ruby_slice(k * max_modules_1side, 0).eq(Qrcode.charcode[(170)]);
            ver_or = ver_or.ruby_slice(k * max_modules_1side, 0).eq(Qrcode.charcode[(170)]);
            k -= 1;
        }
        hor = hor + Qrcode.charcode[(170)] + ver;
        n1_search = (Qrcode.charcode[(255)] * 5) + "+|" + (Qrcode.charcode[bit_r] * 5) + "+";
        n2_search1 = Qrcode.charcode[bit_r] + Qrcode.charcode[bit_r] + "+";
        n2_search2 = Qrcode.charcode[(255)] + Qrcode.charcode[(255)] + "+";
        n3_search = Qrcode.charcode[bit_r] + Qrcode.charcode[(255)] + Qrcode.charcode[bit_r] + Qrcode.charcode[bit_r] + Qrcode.charcode[bit_r] + Qrcode.charcode[(255)] + Qrcode.charcode[bit_r];
        n4_search = Qrcode.charcode[bit_r];
        hor_temp = hor;
        demerit_n3 = (hor_temp.scan(Regexp.compile(n3_search)).length) * 40;
        demerit_n4 = ((((ver.count(n4_search) * 100) / byte_num) - 50) / 5).abs().to_i() * 10;
        demerit_n2 = 0;
        ptn_temp = ver_and.scan(Regexp.compile(n2_search1));
        ptn_temp.each((function (te) {demerit_n2 += (te.length - 1);}));
        ptn_temp = ver_or.scan(Regexp.compile(n2_search2));
        ptn_temp.each((function (te) {demerit_n2 += (te.length - 1);}));
        demerit_n2 *= 3;
        ptn_temp = hor.scan(Regexp.compile(n1_search));
        ptn_temp.each((function (te) {demerit_n1 += (te.length - 2);}));
        demerit_score = demerit_n1 + demerit_n2 + demerit_n3 + demerit_n4;
        if (demerit_score <= min_demerit_score || i == 0) {
            mask_number = i;
            min_demerit_score = demerit_score;
        }
        i += 1;
    }
    mask_content = 1 << mask_number;
    format_information_value = ((ec << 3) | mask_number);
    format_information_array = ["101010000010010", "101000100100101", "101111001111100", "101101101001011", "100010111111001", "100000011001110", "100111110010111", "100101010100000", "111011111000100", "111001011110011", "111110110101010", "111100010011101", "110011000101111", "110001100011000", "110110001000001", "110100101110110", "001011010001001", "001001110111110", "001110011100111", "001100111010000", "000011101100010", "000001001010101", "000110100001100", "000100000111011", "011010101011111", "011000001101000", "011111100110001", "011101000000110", "010010010110100", "010000110000011", "010111011011010", "010101111101101"];
    i = 0;
    while (i < 15) {
        content = format_information_array[format_information_value].ruby_slice(i, 1).to_i();
        matrix_content[format_information_x1[i]][format_information_y1[i]] = content * 255;
        matrix_content[format_information_x2[i]][format_information_y2[i]] = content * 255;
        i += 1;
    }
    out = "";
    mxe = max_modules_1side;
    i = 0;
    while (i < mxe) {
        j = 0;
        while (j < mxe) {
            if ((matrix_content[j][i].to_i() & mask_content) != 0) {
                out += "1";
            } else {
                out += "0";
            }
            j += 1;
        }
        out += "\n";
        i += 1;
    }
    out = this.string_bit_cal(out, frame_data, "or");
    return (out);
}});

