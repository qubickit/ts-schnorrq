export type SchnorrqWasmFixture = Readonly<{
  seed: string;
  secretKey32Hex: string;
  publicKey32Hex: string;
  destinationPublicKey32Hex: string;
  unsignedTxHex: string;
  digest32Hex: string;
  signature64Hex: string;
  k12InputHex: string;
  k12Out32Hex: string;
}>;

export const schnorrqWasmFixture: SchnorrqWasmFixture = {
  seed: "jvhbyzjinlyutyuhsweuxiwootqoevjqwqmdhjeohrytxjxidpbcfyg",
  secretKey32Hex: "179c2d6db171f1af86efbaded25aeb0bc12bf90c0244566aee23e08f082d3863",
  publicKey32Hex: "39665f596c87c5eb34b7c2027ea87737dc5a178dda273a1e67d673e5925b4e82",
  destinationPublicKey32Hex: "9e1a100cfb556def7bcc6252e47ddf0985428637c3d1b3caa16f33fd98438d94",
  unsignedTxHex:
    "39665f596c87c5eb34b7c2027ea87737dc5a178dda273a1e67d673e5925b4e829e1a100cfb556def7bcc6252e47ddf0985428637c3d1b3caa16f33fd98438d9401000000000000003930000000000000",
  digest32Hex: "3ee42f561ac090694fb35e12ba6f642fd0725f77368fc6f0ebaa4d6181476d9d",
  signature64Hex:
    "77a4fecbd22d99e419c44408e11f8921194c06309c255fc21edc9fce4782b92bfec0190c01169fe0e6eb10b55188bb7daf28746faa552e0e564379a9400a2700",
  k12InputHex: "00010203040506070809",
  k12Out32Hex: "e5ef1dd415a069d5c1ee20a731c271d751ec9f301bfb8a51acf27828d231e305",
};

