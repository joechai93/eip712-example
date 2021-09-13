// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract SimpleStorage {
  // using ECDSA for bytes32;
  uint storedData;
  address tomatch = 0xA8D4A3AbB79c77A6c7176C9579185b49f99e3b06;

  function set(uint x) public {
    storedData = x;
  }

  function get() public view returns (uint) {
    return storedData;
  }

  event test_value(address value1);

  // function splitSignature(bytes memory sig)
  //       public
  //       pure
  //       returns (
  //           bytes32 r,
  //           bytes32 s,
  //           uint8 v
  //       )
  //   {
  //       require(sig.length == 65, "invalid signature length");

  //       assembly {
  //           /*
  //           First 32 bytes stores the length of the signature

  //           add(sig, 32) = pointer of sig + 32
  //           effectively, skips first 32 bytes of signature

  //           mload(p) loads next 32 bytes starting at the memory address p into memory
  //           */

  //           // first 32 bytes, after the length prefix
  //           r := mload(add(sig, 32))
  //           // second 32 bytes
  //           s := mload(add(sig, 64))
  //           // final byte (first byte of the next 32 bytes)
  //           v := byte(0, mload(add(sig, 96)))
  //       }

  //       // implicitly return (r, s, v)
  // }
  function recover(bytes32 messageHash, uint8 v, bytes32 r, bytes32 s)
    public
    pure
    returns (address)
  {
    return ecrecover(messageHash, v, r, s);
  }

  function testSigner(bytes memory signature) external view returns (bool) {
    bytes32 temp = keccak256(abi.encode("fsdf"));
    bytes32 hash = ECDSA.toEthSignedMessageHash(temp);
    address recoveredAddr = ECDSA.recover(hash, signature);
  
    return (recoveredAddr == tomatch);
  }

  function executeSetIfSignatureMatch(
    uint8 v,
    bytes32 r,
    bytes32 s,
    address sender,
    uint256 deadline,
    uint x
  ) external {
    emit test_value(sender);
    require(block.timestamp < deadline, "Signed transaction expired");

    // uint chainId;
    // assembly {
    //   chainId := chainid()
    // }
    bytes32 eip712DomainHash = keccak256(
        abi.encode(
            keccak256(
                "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
            ),
            keccak256(bytes("SetTest")),
            keccak256(bytes("1")),
            block.chainid,
            address(this)
        )
    );  

    bytes32 hashStruct = keccak256(
      abi.encode(
          keccak256("set(address sender,uint x,uint deadline)"),
          sender,
          x,
          deadline
        )
    );
    bytes32 hash = keccak256(abi.encodePacked("\x19\x01", eip712DomainHash, hashStruct));
    address signer = ecrecover(hash, v, r, s);
    emit test_value(signer);
    require(signer != address(0), "ECDSA: invalid signature");
    require(signer == sender, "MyFunction: invalid signature");

    set(x);
  }
}