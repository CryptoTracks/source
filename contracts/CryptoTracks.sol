// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

contract CryptoTracks is Ownable, ReentrancyGuard {
  struct Tune {
    uint t1;
    uint t2;
    uint t3;
    uint t4;
    uint t5;
    uint t6;
    uint t7;
    uint t8;
  }

  mapping(address => uint[]) myFavorites;
  mapping(uint => uint) favoriteCount;
  uint favoriteFee = 0.001 ether;
  mapping(uint => address) tuneOwner;
  mapping(address => uint) artistTuneCount;
  Tune[] tunes;

  constructor() {
    uint _t1 = uint(keccak256("Genesis Tune Track 1"));
    uint _t2 = uint(keccak256("Genesis Tune Track 2"));
    uint _t3 = uint(keccak256("Genesis Tune Track 3"));
    uint _t4 = uint(keccak256("Genesis Tune Track 4"));
    uint _t5 = uint(keccak256("Genesis Tune Track 5"));
    uint _t6 = uint(keccak256("Genesis Tune Track 6"));
    uint _t7 = uint(keccak256("Genesis Tune Track 7"));
    uint _t8 = uint(keccak256("Genesis Tune Track 8"));

    tunes.push(Tune(_t1, _t2, _t3, _t4, _t5, _t6, _t7, _t8));
    uint tuneId = tunes.length - 1;
    tuneOwner[tuneId] = _msgSender();
    artistTuneCount[_msgSender()]++;
  }

  function getTune(uint _id) public view returns(
    uint, uint, uint, uint,
    uint, uint, uint, uint,
    address, uint) {
    Tune storage tune = tunes[_id];
    require(tune.t1 != 0);
    address thisTuneOwner = tuneOwner[_id];
    uint favCount = favoriteCount[_id];
    return (tune.t1, tune.t2, tune.t3, tune.t4,
    tune.t5, tune.t6, tune.t7, tune.t8,
    thisTuneOwner, favCount);
  }

  function getTunesLength() public view returns (uint) {
    return tunes.length;
  }

  function publishTune(uint _t1, uint _t2, uint _t3, uint _t4,
    uint _t5, uint _t6, uint _t7, uint _t8) nonReentrant external payable returns (uint) {
    require(_t1 != 0);
    tunes.push(Tune(_t1, _t2, _t3, _t4, _t5, _t6, _t7, _t8));
    uint tuneId = tunes.length - 1;
    tuneOwner[tuneId] = _msgSender();
    artistTuneCount[_msgSender()]++;
    return tuneId;
  }

  function getArtistTunes(address _artist) public view returns(uint[] memory) {
    uint[] memory theseTunes = new uint[](artistTuneCount[_artist]);
    uint inc = 0;
    for (uint i = 0; i < tunes.length; i++) {
      if (tuneOwner[i] == _artist) {
        theseTunes[inc] = i;
        inc++;
      }
    }
    return theseTunes;
  }

  function getMyFavorites() public view returns(uint[] memory) {
    return myFavorites[_msgSender()];
  }

  function favorite(uint _id) nonReentrant external payable {
    require(tuneOwner[_id] != address(0));
    Tune storage tune = tunes[_id];
    require(tune.t1 != 0);
    require(msg.value >= favoriteFee);
    for (uint i = 0; i < myFavorites[_msgSender()].length; i++) {
      require(_id != myFavorites[_msgSender()][i]);
    }
    favoriteCount[_id]++;
    payable(tuneOwner[_id]).transfer(msg.value);
    myFavorites[_msgSender()].push(_id);
  }

  function withdraw() external onlyOwner {
    payable(owner()).transfer(address(this).balance);
  }

  function setFavoriteFee(uint _fee) external onlyOwner {
    favoriteFee = _fee;
  }
}
